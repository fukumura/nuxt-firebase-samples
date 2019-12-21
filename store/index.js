import { vuexfireMutations, firestoreAction } from 'vuexfire'
import firebase from '@/plugins/firebase'

const db = firebase.firestore()

export const state = () => {
  return {
    loading: true,
    user: null,
    authenticated: null,
    isAdmin: false,
    tasks: [],
    questions: [],
    activeQuestions: [],
    selections: [],
    images: []
  }
}

export const mutations = {
  ...vuexfireMutations,
  setUser(state, user) {
    state.user = user
    state.loading = false
  }
}

export const actions = {
  bindChartData: firestoreAction(({ bindFirestoreRef }, payload) => {
    if (payload && payload.questionId) {
      return bindFirestoreRef(
        'questions',
        db
          .collection('questions')
          .where("id",'==',payload.questionId)
      )
    }
    else {
      console.log('questionId is null')
    }
  }),
  bindQuestions: firestoreAction(({ bindFirestoreRef }, payload) => {
    return bindFirestoreRef(
      'questions',
      db
        .collection('questions')
        .orderBy("createdAt", "desc")
    )
  }),
  bindActiveQuestions: firestoreAction(({ bindFirestoreRef }, payload) => {
    return bindFirestoreRef(
      'activeQuestions',
      db
        .collection('questions')
        .where('isClosed', '==', false)
        .orderBy("createdAt", "desc")
    )
  }),
  bindSelections: firestoreAction(({ bindFirestoreRef }, payload) => {
    return bindFirestoreRef(
      'selections',
      db
        .collection('selections')
    )
  }),
  async getChartLabels({ commit }, payload) {
    const question = await db.collection('questions')
                             .doc(payload.questionId)
                             .get()
    const labels = []
    for (const selection of question.data().selectionRefs) {
      const s = await db.collection('selections')
                  .doc(selection.id)
                  .get()
      labels.push(s.data().text)
    }
    return labels
  },
  async alreadyAnswered({ commit }, payload) {
    const answer = await db.collection('answers')
                           .where('uid','==',payload.uid)
                           .where('questionId','==',payload.questionId)
                           .get()
    return (answer && answer.size > 0) ? answer.size : 0
  },
  async getQuestionResult({ commit }, payload) {
    console.log('start getQuestionResult')
    const question = await db.collection('questions')
                             .doc(this.payload.questionId)
                             .get()
    const selections = []
    for (const selection of question.data().selectionRefs) {
      const s = await db.collection('selections')
                        .doc(selection.id)
                        .get()
      selections.push({
        id: s.data().id,
        text: s.data().text,
        answerRefs: s.data().answerRefs
      })
    }
    this.question = question.data()
    this.selections = selections
    const questionResult = await db.collection('answers')
                           .where('uid','==',payload.uid)
                           .where('questionId','==',payload.questionId)
                           .get()
    return questionResult
  },
  async setUser({ commit }, payload) {
    const user = {
      uid: payload.uid,
      email: payload.email,
      displayName: payload.displayName,
      photoURL: payload.photoURL,
      isAdmin: payload.email == 'fukumura.akinori@gmail.com' ? true : false  // TODO: ロジック変えないと(^_^;)
    }
    commit('setUser', user)
    const checkUser = await db.collection('users').where('uid','==', payload.uid).get()
    if (!checkUser.size) {
      db.collection('users').add(user,{merge:true})
    }
  },
  unsetUser({ commit }) {
    commit('setUser', null)
  },
  async setQuestion(context, payload) {
    const selectionRefs = []
    for (const selectionText of payload.selectionNamesRef) {
      // 選択肢保存処理
      const selectionRef = await db.collection('selections').add({
        text: selectionText,
        answerRefs: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      // Refを保持
      selectionRefs.push(selectionRef)
    }

    const questionRef = db.collection('questions').doc()
    await questionRef.set({
      text: payload.text,
      isClosed: payload.isClosed,
      isFinished: payload.isFinished,
      selectionRefs: selectionRefs,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function() {
      console.log("Document successfully written![questions]")
    })
    .catch(function(error) {
      console.error("Error writing document: ", error)
    })
  },
  async setAnswer(context, payload) {
    console.log(payload)
    const answer = await db.collection('answers')
                           .where('uid','==',payload.uid)
                           .where('questionId','==',payload.questionId)
                           .get()
    if (answer && answer.size > 0) {
      console.log('already answered')
      return
    }
    const answerRef = await db.collection('answers').add({
      uid: payload.uid,
      questionId: payload.questionId,
      selectionId: payload.selectionId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    const selectionRef = await db.collection('selections').doc(payload.selectionId)
    await selectionRef.set(
      {
        answerRefs: firebase.firestore.FieldValue.arrayUnion(answerRef)
      },
      {
        merge: true
      }
    ).then(function() {
      console.log("Document successfully written![selections]")
    })
    .catch(function(error) {
      console.error("Error writing document: ", error)
    })

  }
}

export const getters = {
  chartData() {
     return state.chartData
  },
  chartLabels(state) {
    return state.chartLabels
  },
  questions(state) {
    return state.questions
  },
  selections(state) {
    return state.selections
  },
  activeQuestions(state) {
    return state.activeQuestions
  },
  authenticated(state) {
    return state.user !== null
  },
  isAdmin(state) {
    return state.isAdmin
  },
  user(state) {
    return state.user
  },
  loading(state) {
    return state.loading
  }
}
