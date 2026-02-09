import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'Goops Monitor',
    description: 'Real-time distributed health monitor tracking service status, latency, and uptime. Implements parallel non-blocking health checks and automated remediation.',
    tags: ['Golang', 'Concurrency', 'Distributed Systems'],
    link: 'https://github.com/Maximus-08/Goops_Monitor',
  },
  {
    title: 'Assignment Solver',
    description: 'AI-powered automation workflow fetching assignments from Google Classroom and generating structured solutions using LLMs.',
    tags: ['Generative AI', 'LLMs', 'Google APIs', 'Automation'],
    link: 'https://github.com/Maximus-08/Assignment-Solver',
  },
  {
    title: 'Ghost IDE',
    description: 'Browser-based IDE with Remote Code Execution (RCE) engine using Docker containers and WebSocket-based real-time compilation streaming.',
    tags: ['React.js', 'Node.js', 'Docker', 'WebSockets'],
    link: 'https://github.com/Maximus-08/Ghost_IDE',
  },
];

export default function Projects() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="work" className="bg-zinc-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-zinc-100 mb-12"
        >
          Selected Projects
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project) => (
            <motion.a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group p-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer block"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-100">
                  {project.title}
                </h3>
                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              </div>

              <p className="text-sm text-zinc-400 mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
