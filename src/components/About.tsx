import { motion } from 'framer-motion';

export default function About() {
    return (
        <section id="about" className="bg-zinc-950 py-20 px-6 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-2xl font-bold text-zinc-100 mb-8"
                >
                    About Me
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="prose prose-invert prose-zinc max-w-none"
                >
                    <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                        I am a Pre-final Year Student at IIIT Gwalior, passionate about building scalable backend systems and contributing to open source.
                        My expertise lies in <strong>Web Development</strong>, <strong>Go (Golang)</strong>, <strong>Kubernetes</strong>.
                    </p>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        I have a strong track record in problem-solving with over <strong>480+ LeetCode problems</strong> solved and currently contributing
                        to the CNCF ecosystem. I enjoy tackling complex challenges in cloud-native technologies and automation.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
