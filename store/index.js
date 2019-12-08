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
    samples: [],
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
  bindSamples: firestoreAction(({ bindFirestoreRef }, payload) => {
    return bindFirestoreRef(
      'samples',
      db
        .collection('samples')
    )
  }),
  bindQuestions: firestoreAction(({ bindFirestoreRef }, payload) => {
    if (payload && payload.questionId) {
      return bindFirestoreRef(
        'questions',
        db
          .collection('questions')
          .docs(payload.questionId)
      )
    }
    else {
      return bindFirestoreRef(
        'questions',
        db
          .collection('questions')
          .orderBy("createdAt", "desc")
      )
    }
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
    console.log(labels)
    return labels
  },
  async alreadyAnswered({ commit }, payload) {
    const answer = await db.collection('answers')
                           .where('uid','==',payload.uid)
                           .where('questionId','==',payload.questionId)
                           .get()
    return (answer && answer.size > 0) ? answer.size : 0
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
  // TODO: 他の関数からの呼び出し方がわからない
  // setSelection(context, payload) {
  //   const selectionRef = db.collection('selections').add({
  //     text: payload.text,
  //     answerRefs: [],
  //     createdAt: firebase.firestore.FieldValue.serverTimestamp()
  //   }).then(function() {
  //     console.log("Document successfully written![selections]")
  //   })
  //   .catch(function(error) {
  //     console.error("Error writing document: ", error)
  //   })
  //   return selectionRef
  // },
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
    const answer = await db.collection('answers').where('uid','==',payload.uid).where('questionId','==',payload.questionId).get()
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
  samples(state) {
    return state.samples
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
