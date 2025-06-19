import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import RequireAuth from "./routes/RequireAuth";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import NotesPage from "./pages/Notes/NotesPage";
// import FlashcardsPage from "./pages/Flashcards/FlashcardsPage";
// import TaskPage from "./pages/Tasks/TaskPage";
import React from "react";
import RootRedirect from "./routes/RootRedirect";
import TasksPage from "./pages/Tasks/TasksPage";
import FlashcardsPage from "./pages/Flashcards/FlashCardsPage";
import SetFlashcards from "./components/flashCards/SetFlashcards";
import QuizPage from "./pages/Quiz/QuizPage";
import { AuthProvider } from "./context/AuthContext";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please try again.</h2>;
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route
              path="notes"
              element={
                <RequireAuth>
                  <NotesPage />
                </RequireAuth>
              }
            />
            <Route
              path="flashcards"
              element={
                <RequireAuth>
                  <FlashcardsPage />
                </RequireAuth>
              }
            />
            <Route
              path="flashcards/:setId"
              element={
                <RequireAuth>
                  <SetFlashcards />
                </RequireAuth>
              }
            />
            <Route
              path="flashcards/:setId/quiz"
              element={
                <RequireAuth>
                  <QuizPage />
                </RequireAuth>
              }
            />
            <Route
              path="tasks"
              element={
                <RequireAuth>
                  <TasksPage />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
