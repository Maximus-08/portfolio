import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const achievements = [
  {
    title: 'LeetCode',
    description: '330+ Problems Solved',
  },
  {
    title: 'LFX Mentorship',
    description: 'Aspiring Mentee 2026',
  },
  {
    title: 'GSoC',
    description: '2026 Candidate',
  },
];

export default function Achievements() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="bg-zinc-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-zinc-100 mb-12 text-center"
        >
          Achievements & Recognition
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all duration-300 text-center"
            >
              <Trophy className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                {achievement.title}
              </h3>
              <p className="text-sm text-zinc-400">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
