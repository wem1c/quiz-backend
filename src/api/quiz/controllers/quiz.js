"use strict";

/**
 * quiz controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::quiz.quiz", ({ strapi }) => ({
  async score(ctx) {
    const { id } = ctx.params;
    let userAnswers = ctx.request.body;

    let quiz = await strapi.services.quiz.findOne({ id }, ["questions"]);

    let question;
    let score = 0;

    if (quiz) {
      userAnswers.map((userAnsw) => {
        question = quiz.questions.find((qst) => qst.id === userAnsw.questionId);
        if (question) {
          if (question.answer === userAnsw.value) {
            userAnsw.correct = true;
            score += 1;
          } else {
            userAnsw.correct = false;
          }

          userAnsw.correctValue = question.answer;
        }

        return userAnsw;
      });
    }

    const questionCount = quiz.questions.length;

    delete quiz.questions;

    return { quiz, score, scoredAnswers: userAnswers, questionCount };
  },
}));
