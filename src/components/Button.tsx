import { motion } from 'framer-motion';

type Props = {
    text: string;
};

const Button = ({ text }: Props) => {
    const buttonVariants = {
        hover: { scale: 1.1, backgroundColor: '#FF87C2' },
    };

    return (
        <motion.div
            className="bg-[#FF6CAB] m-5 cursor-pointer rounded-xl flex flex-row items-center justify-center w-40 h-15 outline-none border-none"
            variants={buttonVariants}
            whileHover="hover"
        >
            <button className="w-full cursor-pointer h-full bg-transparent text-lg">{text}</button>
        </motion.div>
    );
};

export default Button;