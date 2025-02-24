import { motion } from 'framer-motion';

type Props = {};

const Input = ({ }: Props) => {
    const inputVariants = {
        hover: { scale: 1.05, backgroundColor: '#FF87C2' },
    };

    return (
        <motion.div
            className="flex bg-[#FF6CAB] rounded-2xl outline-none border-none flex-row items-center justify-center"
            variants={inputVariants}
            whileHover="hover"
        >
            <input
                type="email"
                placeholder="Enter your email"
                className="w-80 outline-none border-none h-10 m-2 p-2 rounded-lg"
            />
            <button className="bg-[#FF6CAB] outline-none cursor-pointer border-none text-white h-10 w-20 m-2 rounded-lg">
                Submit
            </button>
        </motion.div>
    );
};

export default Input;