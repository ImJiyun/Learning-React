import QuestionTimer from "./QuestionTimer";
import Answers from "./Answers.jsx";

export default function Question({
  questionText,
  answers,
  onSelectAnswer,
  selectedAnswer,
  answerState,
  onSkipAnswer,
}) {
  return (
    <div id="questions">
      {/* 10000 = 10 seconds */}
      {/* key prop : whenever it changes, React will distroy the old component and create a new one */}
      <QuestionTimer timeout={10000} onTimeout={onSkipAnswer} />
      <h2>{questionText}</h2>
      <Answers
        answers={answers}
        selectedAnswer={selectedAnswer}
        answerState={answerState}
        onSelect={onSelectAnswer}
      />
    </div>
  );
}
