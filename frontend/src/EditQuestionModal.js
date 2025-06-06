import React, { useState, useEffect } from "react";

const EditQuestionModal = ({ question, onUpdateQuestion, onClose }) => {
  const [editedQuestion, setEditedQuestion] = useState({});

  useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  const handleChange = (e) => {
    setEditedQuestion((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateQuestion(editedQuestion); // Backend'e güncelleme yollayan fonksiyon
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Question</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Question:</label>
                <input
                  type="text"
                  name="questionText"
                  value={editedQuestion.questionText || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              {[1, 2, 3, 4].map((n) => (
                <div className="form-group" key={n}>
                  <label>Option {n}:</label>
                  <input
                    type="text"
                    name={`option${n}`}
                    value={editedQuestion[`option${n}`] || ""}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              ))}
              <div className="form-group">
                <label>Correct Option:</label>
                <select
                  name="correctOption"
                  value={editedQuestion.correctOption || 1}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Update</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuestionModal;
