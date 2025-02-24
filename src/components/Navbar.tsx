import { motion } from "framer-motion";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FiPhone } from "react-icons/fi";
import { MdOutlineMiscellaneousServices } from "react-icons/md";

function Navbar() {
    const navItems = [
        { icon: <IoHomeOutline size={20} />, text: "Home" },
        { icon: <MdOutlineMiscellaneousServices size={20} />, text: "Services" },
        { icon: <IoIosInformationCircleOutline size={20} />, text: "About Us" },
        { icon: <FiPhone size={20} />, text: "Contact Us" }
    ];

    return (
        <motion.nav
            className="fixed top-0 h-20  w-full bg-black/50 backdrop-blur-lg border-b border-white/10 z-50"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2"
                    >
                        <img
                            src="./corona-checker.png"
                            className="w-12 h-12 rounded-lg object-cover border-2 border-white/10"
                            alt="Logo"
                        />
                        <span className="text-xl font-bold bg-gradient-to-r from-[#FF6CAB] to-[#7366FF] bg-clip-text text-transparent">
                            ViroVision
                        </span>
                    </motion.div>

                    {/* Navigation Items */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.text}
                                className="relative group"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                <a
                                    href="#"
                                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    <motion.span whileHover={{ scale: 1.1 }}>
                                        {item.icon}
                                    </motion.span>
                                    <span className="text-lg font-medium">{item.text}</span>
                                </a>

                                {/* Animated underline */}
                                <motion.div
                                    className="absolute bottom-0 left-0 w-full h-px bg-[#FF6CAB]"
                                    initial={{ scaleX: 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}

export default Navbar;