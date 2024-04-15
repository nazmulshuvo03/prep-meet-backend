const pointCountAnswerType1 = (answers) => {
  let count = 0;
  for (let answer of answers) {
    if (answer === 1) count += 1;
  }
  return count;
};

const pointCountAnswerType2 = (answers) => {
  let count = 0;
  for (let answer of answers) {
    if (answer === 2) count += 0.5;
    if (answer === 3) count += 1;
    if (answer === 4) count += 1.5;
    if (answer === 5) count += 2;
  }
  return count;
};

const totalSelfAssessmentPoint = (answers1, answers2) => {
  if (Array.isArray(answers1) && Array.isArray(answers2)) {
    return pointCountAnswerType1(answers1) + pointCountAnswerType2(answers2);
  } else return 0;
};

module.exports = {
  totalSelfAssessmentPoint,
};
