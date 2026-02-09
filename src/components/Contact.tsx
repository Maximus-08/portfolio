import { motion } from 'framer-motion';
import { Send, Github, Linkedin, Code2, Copy, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("https://formsubmit.co/ajax/avnishjaltare8@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    _subject: `Portfolio Contact from ${formData.name}`
                })
            });

            if (response.ok) {
                setIsSubmitted(true);
                setFormData({ name: '', email: '', message: '' });
            } else {
                alert("Something went wrong. Please try again or email directly.");
            }
        } catch {
            alert("Error sending message. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const copyEmail = () => {
        navigator.clipboard.writeText('avnishjaltare8@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="contact" className="bg-zinc-950 py-20 px-6 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-zinc-100 mb-4">Get in Touch</h2>
                    <p className="text-zinc-400">
                        Have a project in mind or just want to say hi?
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-xl font-semibold text-zinc-100 mb-6">Connect</h3>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={copyEmail}
                                className="flex items-center justify-between text-zinc-400 hover:text-zinc-100 transition-colors p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-white/10 group"
                            >
                                <div className="flex items-center gap-3">
                                    <Send className="w-5 h-5" />
                                    <span>avnishjaltare8@gmail.com</span>
                                </div>
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </button>

                            <a
                                href="https://github.com/Maximus-08"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-zinc-400 hover:text-zinc-100 transition-colors p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-white/10"
                            >
                                <Github className="w-5 h-5" />
                                <span>GitHub</span>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/avnish-jaltare-508abb288/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-zinc-400 hover:text-zinc-100 transition-colors p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-white/10"
                            >
                                <Linkedin className="w-5 h-5" />
                                <span>LinkedIn</span>
                            </a>
                            <a
                                href="https://leetcode.com/u/Maximus-08/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-zinc-400 hover:text-zinc-100 transition-colors p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-white/10"
                            >
                                <Code2 className="w-5 h-5" />
                                <span>LeetCode</span>
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg text-center"
                                >
                                    <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                    <h3 className="text-xl font-bold text-green-400 mb-2">Message Sent!</h3>
                                    <p className="text-zinc-400 text-sm">Thanks for reaching out. I'll get back to you soon.</p>
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="mt-4 text-sm text-green-400 hover:text-green-300 underline"
                                    >
                                        Send another message
                                    </button>
                                </motion.div>
                            ) : (
                                <>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-1">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-zinc-900/50 border border-white/5 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-zinc-100 placeholder-zinc-600 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-zinc-900/50 border border-white/5 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-zinc-100 placeholder-zinc-600 outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-1">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={4}
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-zinc-900/50 border border-white/5 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-zinc-100 placeholder-zinc-600 outline-none transition-all resize-none"
                                            placeholder="Hello..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full px-6 py-3 bg-white text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
