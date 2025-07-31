import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";

const features = [
  {
    emoji: "✍️",
    title: "Notes",
    desc: "Create, edit, and organize your study notes with ease.",
  },
  {
    emoji: "✅",
    title: "Tasks",
    desc: "Manage to-dos, deadlines, and academic priorities.",
  },
  {
    emoji: "🧠",
    title: "Flashcards",
    desc: "Build flashcard sets for memorization and self-testing.",
  },
  {
    emoji: "🤝",
    title: "Study Groups",
    desc: "Collaborate with peers, share resources, and study together.",
  },
  {
    emoji: "💬",
    title: "Group Study Chat",
    desc: "Real-time chat for group study (coming soon!)",
    soon: true,
  },
  {
    emoji: "🤖",
    title: "AI Assistant",
    desc: "Summarize, generate, and quiz yourself with AI-powered help.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-pink-500/30 rounded-full filter blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full filter blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
      {/* Starry Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-0"></div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-[#0f172a]/70 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-3xl">📚</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Study Companion
          </span>
        </div>
        <nav className="hidden md:flex gap-8">
          {["features", "about", "contact"].map((id) => (
            <ScrollLink
              key={id}
              to={id}
              smooth={true}
              duration={600}
              offset={-100}
              className="cursor-pointer text-white/80 hover:text-white font-medium transition"
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </ScrollLink>
          ))}
        </nav>
        <Link to="/login">
          <button className="bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105">
            Login
          </button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center px-6 flex-1">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mt-16 mb-20">
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-pink-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg mb-6"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Supercharge Your Studies
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            All-in-one platform for notes, flashcards, tasks, group study, and
            AI-powered assistance — built to help you excel.
          </motion.p>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Link to="/login">
              <button className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 text-white font-semibold px-12 py-4 rounded-full text-xl shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-500/50">
                Get Started Free
              </button>
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="scroll-mt-32 w-full max-w-6xl mb-20">
          <h2 className="text-4xl font-bold text-white mb-10 text-center drop-shadow">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className={`bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-7 flex flex-col items-start gap-4 hover:scale-105 hover:shadow-2xl transition-transform border border-white/10`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.6 }}
              >
                <span className="text-4xl">{f.emoji}</span>
                <div className="font-bold text-2xl text-white">{f.title}</div>
                <div className="text-gray-200">{f.desc}</div>
                {f.soon && (
                  <span className="mt-2 text-xs bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full font-semibold animate-pulse">
                    Coming Soon
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="scroll-mt-32 w-full max-w-4xl mb-20">
          <h2 className="text-3xl font-bold text-white mb-6 drop-shadow">
            Why Study Companion?
          </h2>
          <p className="text-white/90 text-lg mb-6">
            Study Companion helps students and lifelong learners stay organized,
            collaborate effectively, and reach their academic goals. Whether
            you're managing tasks, revising for exams, or working with a group,
            our platform is your complete study hub.
          </p>
          <ul className="list-disc list-inside text-white/80 text-lg space-y-2">
            <li>Organize notes, tasks, and flashcards in one place.</li>
            <li>Collaborate in real-time with study groups and chat.</li>
            <li>
              Leverage AI to summarize, generate quizzes, and boost
              productivity.
            </li>
            <li>Accessible anywhere, anytime.</li>
          </ul>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="scroll-mt-32 w-full max-w-2xl mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow">
            Contact & Feedback
          </h2>
          <p className="text-white/80 mb-4">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <a
            href="mailto:hello@studycompanion.app"
            className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-8 py-3 rounded-full shadow hover:bg-white/20 transition"
          >
            Email Us
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0f172a]/80 backdrop-blur-xl border-t border-white/10 py-6 px-8 flex flex-col md:flex-row items-center justify-between text-white/70">
        <span className="text-lg">
          © {new Date().getFullYear()} Study Companion
        </span>
        <span className="text-sm">Made with ❤️ for learners</span>
      </footer>
    </div>
  );
}
