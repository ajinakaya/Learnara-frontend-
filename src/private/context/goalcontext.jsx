import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./authcontext"; 

const GoalContext = createContext();

export const GoalProvider = ({ children }) => {
  const { authToken } = useAuth(); 
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authToken) {
      fetchGoals();
   
    }
  }, [authToken]);

  // Fetch user goals
  const fetchGoals = async () => {
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/learning-goal/get", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setGoals(response.data);
    } catch (err) {
      setError("Failed to load goals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  

  // Add a new goal
  const addGoal = async (formData) => {
    if (!authToken) return;
    try {
      setLoading(true);
      const response = await axios.post("/learning-goal/goal", formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setGoals([...goals, response.data]);
    } catch (err) {
      setError("Failed to add goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update an existing goal
  const updateGoal = async (goalId, formData) => {
    if (!authToken) return;
    try {
      setLoading(true);
      const response = await axios.put(
        "/learning-goal/update",
        { _id: goalId, ...formData },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setGoals(goals.map((goal) => (goal._id === goalId ? response.data : goal)));
    } catch (err) {
      setError("Failed to update goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a goal
  const deleteGoal = async (goalId) => {
    if (!authToken) return;
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    try {
      setLoading(true);
      await axios.delete("/learning-goal/delete", {
        headers: { Authorization: `Bearer ${authToken}` },
        data: { _id: goalId },
      });
      setGoals(goals.filter((goal) => goal._id !== goalId));
    } catch (err) {
      setError("Failed to delete goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        loading,
        error,
        addGoal,
        updateGoal,
        deleteGoal,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

// Custom Hook to use GoalContext
export const useGoals = () => {
  return useContext(GoalContext);
};
