import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import EditQuestionModal from "./EditQuestionModal";
import { HeaderNav } from "./HeaderNav";
import { getDecodedToken } from "./utils/auth";
const AdminDashboard = () => {
  const [username, setUsername] = useState("");
  const [activePage, setActivePage] = useState("generate-quiz");
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState([]);

  const [generateQuizName, setGenerateQuizName] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctOption: 1 },
  ]);

  const [userResponses, setUserResponses] = useState([]);
  const [responseError, setResponseError] = useState("");

  const token = localStorage.getItem("jwt_token");

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    window.location.href = "/";
  };

  const assignQuestionToQuiz = async (quizId, questionId) => {
    try {
      await axios.post("http://localhost:8080/api/quiz-questions/assign", null, {
        params: { quizId, questionId },
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchQuizQuestions(quizId);
      alert("Question assigned successfully");
    } catch (err) {
      alert(err.response?.data || "Failed to assign question");
    }
  };

  const removeQuestionFromQuiz = async (quizId, questionId) => {
    try {
      await axios.delete("http://localhost:8080/api/quiz-questions/remove", {
        params: { quizId, questionId },
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchQuizQuestions(quizId);
      alert("Question removed successfully");
    } catch (err) {
      alert("Failed to remove question");
    }
  };

  const fetchAvailableQuestions = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch all questions");
    }
  }, [token]);

  const fetchQuizQuestions = useCallback(async (quizId) => {
    try {
      const res = await axios.get("http://localhost:8080/api/quiz-questions/by-quiz", {
        params: { quizId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch quiz questions");
    }
  }, [token]);

  const fetchQuizList = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/quizzes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizList(response.data);
      console.log("Gelen quiz listesi:", response.data);

    } catch (error) {
      console.error("Failed to fetch quiz list");
    }
  }, [token]);

  const fetchUserResponses = useCallback(async () => {
    try {
      const decoded = getDecodedToken(); // JWT çözümle
      const isAdmin = decoded?.role === "ADMIN";
      const userId = decoded?.userId || decoded?.id || decoded?.sub;

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Admin için userId parametresi göndermiyoruz
      const response = isAdmin
        ? await axios.get("http://localhost:8080/api/user-answers", config)
        : await axios.get("http://localhost:8080/api/user-answers", {
            ...config,
            params: { userId }
          });

      console.log("Fetching user responses for userId:", userId);
      console.log("Response:", response.data);
      setUserResponses(response.data);
    } catch (error) {
      setResponseError("Failed to fetch user responses");
      console.error("AxiosError", error);
    }
  }, [token]);



  useEffect(() => {
    const decoded = getDecodedToken();
    if (decoded) {
      setUsername(decoded.username || decoded.sub);
    }
    fetchQuizList();
    fetchUserResponses();
  }, [fetchQuizList, fetchUserResponses]);
useEffect(() => {
  console.log("Available Questions geldi:", availableQuestions);
}, [availableQuestions]);

useEffect(() => {
  console.log("Quiz Questions geldi:", quizQuestions);
}, [quizQuestions]);

  const handleQuizDelete = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuizList();
    } catch (error) {
      console.error("Failed to delete quiz");
    }
  };

  const handleQuizSelect = async (quizId) => {
    await fetchQuizQuestions(quizId);
    setSelectedQuiz(quizId);
    await fetchAvailableQuestions();
  };

  const handleEditQuestion = (question) => {
    setQuestionToEdit(question);
    setShowEditModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setQuestionToEdit(null);
    fetchQuizList();
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctOption: 1 },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === "questionText") {
      updated[index].questionText = value;
    } else if (field.startsWith("option")) {
      const i = parseInt(field.replace("option", "")) - 1;
      updated[index].options[i] = value;
    } else if (field === "correctOption") {
      updated[index].correctOption = parseInt(value);
    }
    setQuestions(updated);
  };

  const handleUpdateQuestion = async (updatedQuestion) => {
    try {
      await axios.put(
        `http://localhost:8080/api/questions/${updatedQuestion.id}`,
        updatedQuestion,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Question updated successfully");
      setShowEditModal(false);
      setQuestionToEdit(null);
      if (selectedQuiz) {
        await handleQuizSelect(selectedQuiz);
      }
    } catch (error) {
      console.error("Failed to update question:", error);
      alert("Failed to update question");
    }
  };

  const handleGenerateQuizSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      quizName: generateQuizName,
      questions: questions.map((q) => ({
        questionText: q.questionText,
        option1: q.options[0],
        option2: q.options[1],
        option3: q.options[2],
        option4: q.options[3],
        correctOption: q.correctOption,
      })),
    };
    const decoded = getDecodedToken();
    const userId = decoded?.userId || decoded?.id || decoded?.sub;

    try {
      await axios.post(
        `http://localhost:8080/api/quizzes/generate?userId=${userId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Quiz created successfully!");
      setGenerateQuizName("");
      setQuestions([{ questionText: "", options: ["", "", "", ""], correctOption: 1 }]);
    } catch (err) {
      console.error("Failed to generate quiz", err);
      alert("Failed to generate quiz");
    }
  };
   return (
    <div>
      <HeaderNav username={username} onNavSelect={setActivePage} onLogout={handleLogout} />
      <div className="container mt-4">
        <h2>Admin Dashboard</h2>
         {activePage === "show-question" && (
           <>
             <h3>Existing Quizzes</h3>
             {Array.isArray(quizList) && quizList.length > 0 ? (
               <>
                 <ul className="list-group mb-4">
                   {quizList.map((quiz) => (
                     <li key={quiz.id} className="list-group-item">
                       <span>{quiz.name} - {quiz.description}</span>
                       <button
                         className="btn btn-primary ml-2"
                         onClick={() => handleQuizSelect(quiz.id)}
                       >
                         View Questions
                       </button>
                       <button
                         className="btn btn-danger ml-2"
                         onClick={() => handleQuizDelete(quiz.id)}
                       >
                         Delete
                       </button>
                     </li>
                   ))}
                 </ul>

                 {selectedQuiz && (
                   <div className="mt-4">
                     <h4>Questions Assigned to Quiz</h4>
                     {quizQuestions.length > 0 ? (
                       quizQuestions.map((q) => (
                         <div key={q.id} className="d-flex align-items-center mb-2">
                           <span className="flex-grow-1">{q.content || q.questionText}</span>
                           <button
                             className="btn btn-sm btn-warning mr-2"
                             onClick={() => handleEditQuestion(q)}
                           >
                             Edit
                           </button>
                           <button
                             className="btn btn-sm btn-danger"
                             onClick={() => removeQuestionFromQuiz(selectedQuiz, q.id)}
                           >
                             Remove
                           </button>
                         </div>
                       ))
                     ) : (
                       <p>No questions assigned yet.</p>
                     )}

                     <h4 className="mt-4">Available Questions to Assign</h4>
                     {availableQuestions
                       .filter((q) => !quizQuestions.find((qq) => String(qq.id) ===String(q.id)))
                       .map((q) => (
                         <div key={q.id} className="d-flex align-items-center mb-2">
                           <span className="flex-grow-1">{q.content || q.questionText}</span>
                           <button
                             className="btn btn-sm btn-success ml-2"
                             onClick={() => assignQuestionToQuiz(selectedQuiz, q.id)}
                           >
                             Assign
                           </button>
                         </div>
                     ))}
                   </div>
                 )}
               </>
             ) : (
               <p>No quizzes available.</p>
             )}
           </>
         )}



        {activePage === "generate-quiz" && (
          <>
            <h3>Generate New Quiz</h3>
            <form onSubmit={handleGenerateQuizSubmit}>
              <div className="form-group">
                <label>Quiz Name:</label>
                <input
                  className="form-control"
                  type="text"
                  value={generateQuizName}
                  onChange={(e) => setGenerateQuizName(e.target.value)}
                  required
                />
              </div>

              {questions.map((q, index) => (
                <div key={index} className="border p-3 mb-3">
                  <h5>Question {index + 1}</h5>
                  <div className="form-group mb-2">
                    <label>Question Text:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={q.questionText}
                      onChange={(e) =>
                        handleQuestionChange(index, "questionText", e.target.value)
                      }
                      required
                    />
                  </div>
                  {q.options.map((opt, i) => (
                    <div className="form-group mb-2" key={i}>
                      <label>Option {i + 1}:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={opt}
                        onChange={(e) =>
                          handleQuestionChange(index, `option${i + 1}`, e.target.value)
                        }
                        required
                      />
                    </div>
                  ))}
                  <div className="form-group">
                    <label>Correct Option (1-4):</label>
                    <select
                      className="form-control"
                      value={q.correctOption}
                      onChange={(e) =>
                        handleQuestionChange(index, "correctOption", e.target.value)
                      }
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              <button type="button" className="btn btn-secondary" onClick={handleAddQuestion}>
                Add Another Question
              </button>
              <button type="submit" className="btn btn-primary ml-3">
                Create Quiz
              </button>
            </form>
          </>
        )}

        {activePage === "validate-answer" && (
          <>
            <h3>User Responses</h3>
            {userResponses.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Question</th>
                    <th>Selected Option</th>
                    <th>Correct Option</th>
                  </tr>
                </thead>
                <tbody>
                  {userResponses.map((response) => (
                    <tr key={response.id}>
                      <td>{response.user?.username}</td>
                      <td>{response.question?.content}</td>
                      <td>{response.selectedOption}</td>
                      <td>{response.question?.correctAnswer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No user responses found.</p>
            )}
            {responseError && <div className="text-danger mt-2">{responseError}</div>}
          </>
        )}
      </div>

      {showEditModal && (
        <EditQuestionModal
          question={questionToEdit}
          onClose={handleModalClose}
          //onUpdate={fetchQuizList}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
