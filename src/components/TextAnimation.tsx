import { motion } from "framer-motion";

type Props = {
    text: string;
    className?: string;
    color?: string;
};

function TextAnimation({ text, className = "", color = "#FF6CAB" }: Props) {
    const characters = text.split("");

    const animation = {
        hidden: {
            y: 40,
            opacity: 0,
            rotateX: -45,
            filter: "blur(4px)"
        },
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            rotateX: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                mass: 0.8,
                stiffness: 120,
                damping: 12,
                delay: i * 0.03,
            }
        }),
        hover: {
            scale: 1.05,
            textShadow: `0 0 20px ${color}`,
            transition: { type: "spring", stiffness: 300 }
        }
    };

    return (
        <motion.div
            className={`flex justify-center items-center cursor-default ${className}`}
            initial="hidden"
            animate="visible"
            whileHover="hover"
        >
            {characters.map((char, index) => (
                <motion.span
                    key={index}
                    className="inline-block font-bold"
                    style={{
                        background: `linear-gradient(45deg, ${color}, #7366FF)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                    variants={animation}
                    custom={index}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.div>
    );
}

export default TextAnimation;