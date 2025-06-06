import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getDecodedToken } from "./utils/auth";
import UserHeaderNav from "./UserHeaderNav";

const UserDashboard = () => {
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [marks, setMarks] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [solvedQuizzes, setSolvedQuizzes] = useState([]);

  const token = localStorage.getItem("jwt_token");

  const fetchQuizzes = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/quizzes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizList(response.data);
    } catch (error) {
      console.error("Error fetching quizzes", error);
    }
  }, [token]);

  const handleQuizSelect = useCallback(async (quizId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/quizzes/getQuizQuestById/${quizId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuizQuestions(response.data);
      setSelectedQuiz(quizId);
      setSelectedOptions([]);
      setShowResults(false);
      setMarks(0);
    } catch (error) {
      console.error("Error fetching quiz questions", error);
    }
  }, [token]);

  const handleOptionChange = (questionId, optionNumber) => {
    setSelectedOptions((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((o) => o.questionId === questionId);

      if (index !== -1) {
        updated[index] = { questionId, optionNumber };
      } else {
        updated.push({ questionId, optionNumber });
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let newMarks = 0;

      for (const userAnswer of selectedOptions) {
        const { questionId, optionNumber } = userAnswer;

        const userAnswers = {
          user: { id: userId },
          question: { id: questionId },
          selectedOption: optionNumber,
        };

        await axios.post("http://localhost:8080/api/user-answers/submit", userAnswers, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const selectedQuestion = quizQuestions.find((q) => q.id === questionId);
        if (selectedQuestion.correctAnswer === optionNumber) {
          newMarks += 1;
        }
      }

      setMarks(newMarks);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting quiz answers", error);
    }
  };

  useEffect(() => {
    const decoded = getDecodedToken();
    if (decoded) {
      try {
        setUsername(decoded.username || decoded.sub);
        setUserId(decoded.userId || decoded.id);
      } catch (err) {
        console.error("Token çözümlenemedi:", err);
      }
    }

    fetchQuizzes();
  }, [token, fetchQuizzes]);

  useEffect(() => {
    if (activePage === "solved-quizzes") {
      axios
        .get("http://localhost:8080/api/user-answers/user/solved-quizzes", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setSolvedQuizzes(res.data))
        .catch((err) => console.error("Çözülen quizler alınırken hata:", err));
    }
  }, [activePage, token]);
  const optionNumberToLetter = (number) => {
    const letters = ["A", "B", "C", "D"];
    return letters[number - 1] || "";
  };

  return (
      <>
        <UserHeaderNav username={username} setActivePage={setActivePage} />
        <div className="container mt-4">
          <div className="card shadow p-4 border-0 rounded-4">
            <h2 className="text-center mb-4">Hello, {username} 👋</h2>

            {activePage === "dashboard" && (
              <>
                <h4 className="mb-3">Available Quizzes</h4>
                <div className="row">
                  {quizList.map((quiz) => (
                    <div key={quiz.id} className="col-md-6 col-lg-4 mb-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body d-flex flex-column justify-content-between">
                          <h5 className="card-title">{quiz.name}</h5>
                          <button
                            className="btn btn-outline-primary mt-3"
                            onClick={() => handleQuizSelect(quiz.id)}
                          >
                            Start Quiz
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activePage === "dashboard" &&
              selectedQuiz &&
              quizQuestions.length > 0 &&
              !showResults && (
                <div>
                  <h4 className="mb-3">Quiz Questions</h4>
                  {quizQuestions.map((question) => (
                    <div key={question.id} className="mb-4">
                      <h5>{question.content}</h5>
                      <div className="list-group">
                        {["A", "B", "C", "D"].map((letter, index) => (
                          <label
                            key={letter}
                            className="list-group-item list-group-item-action"
                          >
                            <input
                              type="radio"
                              className="form-check-input me-2"
                              name={`question-${question.id}`}
                              value={index + 1}
                              onChange={() =>
                                handleOptionChange(question.id, index + 1)
                              }
                            />
                            {question[`option${letter}`]}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                    Submit Quiz
                  </button>
                </div>
              )}

            {activePage === "dashboard" && showResults && (
              <div className="mt-4">
                <div className="alert alert-info">
                  <h4>Results</h4>
                  <p>
                    You scored <strong>{marks}</strong> out of{" "}
                    <strong>{quizQuestions.length}</strong>.
                  </p>
                </div>

                {quizQuestions.map((question) => {
                  const userAnswer = selectedOptions.find(
                    (opt) => opt.questionId === question.id
                  );
                  const isCorrect =
                    userAnswer?.optionNumber === question.correctAnswer;

                  return (
                    <div key={question.id} className="card mb-3 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{question.content}</h5>
                        <p>
                          <strong>Your answer:</strong>{" "}
                          {question[`option${userAnswer?.optionNumber}`]}
                        </p>
                        <p className={isCorrect ? "text-success" : "text-danger"}>
                          {isCorrect ? (
                            <>
                              ✅ <strong>Correct!</strong>
                            </>
                          ) : (
                            <>
                              ❌ <strong>Correct answer:</strong>{" "}
                              {question[`option${optionNumberToLetter(question.correctAnswer)}`]}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activePage === "solved-quizzes" && (
              <div className="mt-4">
                <h4 className="mb-3">Quizzes You Solved</h4>
                <div className="row">
                  {solvedQuizzes.length === 0 ? (
                    <p>Henüz çözülmüş quiz bulunmamaktadır.</p>
                  ) : (
                    solvedQuizzes.map((quiz) => (
                      <div key={quiz.id} className="col-md-6 col-lg-4 mb-3">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body">
                            <h6 className="card-title text-center text-primary">
                              {quiz.name}
                            </h6>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

export default UserDashboard;