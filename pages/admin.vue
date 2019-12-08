<template>
  <v-container>
    <v-flex xs12>
      <h1>Question 作成</h1>
    </v-flex>
    <v-layout>
      <v-flex xs8>
        <v-text-field class="question" v-model="edit.question.text" label="質問を入力してください"></v-text-field>
      </v-flex>
    </v-layout>
    <hr class="separator">
      <v-flex xs8>
        <v-text-field
          class="selection"
          label="選択肢を入力してください"
          v-model="selectionText.text"
          v-for="(selectionText, index) in edit.selections"
          :key="index"
        ></v-text-field>
      </v-flex>
    <hr class="separator">
    <v-flex xs4>
      <v-btn type='primary' @click="save($events)">create</v-btn>
    </v-flex>
  </v-container>
</template>

<style lang="scss" scoped>
.separator {
  margin: 1.5rem 0;
  border: none;
  border-bottom: 1px solid #999;
}
.selection {
  & + & {
    margin-top: 1rem;
  }
}
.table {
  width: 100%;
  color: #999;
  & thead th {
    border-bottom: 1px solid #ccc;
  }
  & th, & td {
    padding: .5rem;
  }
  & td:last-child {
    text-align: right;
  }
}
.button {
  display: block;
  margin: 0 auto;
}
</style>

<script>
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      edit: {
        question: {
          text: ''
        },
        selections: [
          {
            text: ''
          },
          {
            text: ''
          },
          {
            text: ''
          },
          {
            text: ''
          }
        ]
      }
    }
  },
  created () {
    this.bindQuestions(),
    this.bindSelections(),
    this.bindActiveQuestions()
  },
  computed: {
    ...mapGetters(['authenticated', 'selections', 'questions'])
  },
  methods: {
    ...mapActions(['bindSelections','bindQuestions','bindActiveQuestions','setSelection','setQuestion']),
    /**
     * 保存処理
     */
    save (event) {
      // バリデーション
      if (!this.edit.question.text) {
        alert('質問を入力してください')
        return
      }
      let selectionTextJoined = ''
      for (const selection of this.edit.selections) {
        selectionTextJoined += selection.text
      }
      if (!selectionTextJoined) {
        alert('選択肢を入力してください')
        return
      }
      const selectionNamesRef = []
      for (const selection of this.edit.selections) {
         if (!selection.text) {
           continue
         }
         selectionNamesRef.push(selection.text)
      }
      // 質問保存処理
      this.setQuestion({
        selectionNamesRef: selectionNamesRef,
        text: this.edit.question.text,
        isFinished: false,
        isClosed: false
      })
      alert('質問が作成されました'); //TODO: 表現
      // 入力値クリア
      this.edit.question.text = ''
      for (const index in this.edit.selections) {
        this.edit.selections[index].text = ''
      }
    },
    /**
     * 解答締切処理
     */
    async close (event, selection) {
      const questionRef = await questions.doc(this.question.id)
      // 質問のステータスを更新
      await questionRef.set(
        {
          isClosed: true
        },
        {
          merge: true
        }
      )
    }
  }
}
</script>
