import Input from "./Input";
import { FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { FaSquareTwitter, FaSquareInstagram } from "react-icons/fa6";
import { motion } from "framer-motion";

function Footer() {
    const listItemVariants = {
        hover: {
            color: "#FF6CAB",
            transition: { type: "spring", stiffness: 300 }
        }
    };

    const borderVariants = {
        hover: {
            scaleX: 1,
            transition: { type: "spring", stiffness: 300 }
        }
    };

    return (
        <div className="bg-[#0F0F15] w-full relative mt-20 border-t border-[#FFFFFF10]">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Top Section */}
                <div className="grid md:grid-cols-3 gap-8 mb-16 relative">
                    {/* Newsletter Column */}
                    <div className="space-y-4">
                        <motion.h2 
                            className="text-3xl font-bold bg-gradient-to-r from-[#FF6CAB] to-[#7366FF] bg-clip-text text-transparent"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                        >
                            Get Updates
                        </motion.h2>
                        <p className="text-gray-400 text-lg">
                            Subscribe to ViroVision for real-time COVID-19 insights and expert analysis.
                        </p>
                    </div>

                    {/* Input Section */}
                    <div className="flex items-center justify-center">
                        <motion.div 
                            className="w-full max-w-md"
                            initial={{ scale: 0.9 }}
                            whileInView={{ scale: 1 }}
                            transition={{ type: "spring" }}
                        >
                            <Input />
                        </motion.div>
                    </div>

                    {/* Social Media */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-300">Follow Us</h2>
                        <div className="flex space-x-6">
                            {[FaFacebookSquare, FaSquareTwitter, FaLinkedin, FaSquareInstagram].map((Icon, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.1, color: "#FF6CAB" }}
                                    className="text-gray-400 cursor-pointer"
                                >
                                    <Icon size={32} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Links Section */}
                <div className="grid md:grid-cols-3 gap-8 py-12 border-y border-[#FFFFFF10]">
                    {[
                        ["About ViroVision", "Resources & links", "Careers", "News"],
                        ["Online Portal", "ViroVision Community", "Locate Professional", "Confirm Certification Status"],
                        ["Privacy Policy", "Terms of Service", "FAQ"]
                    ].map((column, colIndex) => (
                        <motion.ul 
                            key={colIndex}
                            className="space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: colIndex * 0.1 }}
                        >
                            {column.map((item) => (
                                <motion.li
                                    key={item}
                                    className="relative group"
                                    variants={listItemVariants}
                                    initial={{ color: "#ffffff" }}
                                    whileHover="hover"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-[#FF6CAB] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-gray-400 group-hover:text-[#FF6CAB] transition-colors">
                                            {item}
                                        </span>
                                    </div>
                                    <motion.div
                                        className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[#FF6CAB] to-[#7366FF]"
                                        variants={borderVariants}
                                        initial={{ scaleX: 0 }}
                                    />
                                </motion.li>
                            ))}
                        </motion.ul>
                    ))}
                </div>

                {/* Copyright */}
                <motion.div
                    className="pt-8 text-center text-gray-500"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                >
                    © {new Date().getFullYear()} CoronaGuardian. All rights reserved.
                </motion.div>
            </div>
        </div>
    );
}

export default Footer;