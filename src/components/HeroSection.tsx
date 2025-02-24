import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import TextAnimation from './TextAnimation';
import Button from './Button';

export default function HeroSection() {
    return (
        <div className="w-full min-h-screen relative overflow-hidden">
            {/* Full-screen Spline background */}
            <div className="absolute inset-0 z-0">
                <Spline
                    scene="https://prod.spline.design/bGci8UtdXE83V8cQ/scene.splinecode"
                    className="w-full h-full"
                />
            </div>

            {/* Text content positioned absolutely next to Spline */}
            <motion.div
                className="absolute text-center left-8 top-1/2 -translate-y-1/2 z-40 w-1/3"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            >
                <div className="glass-panel p-8 rounded-2xl backdrop-blur-lg border border-white/10 shadow-xl">
                    <TextAnimation
                        text="COVID-19 AI Tracker"
                        className='text-xl'
                    />

                    <motion.p
                        className="text-lg text-gray-300 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                    >
                        Advanced neural network analyzing global pandemic patterns in real-time
                    </motion.p>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.2 }}
                    >
                        <Button
                            text="Explore Dashboard"
                        />
                    </motion.div>
                </div>
            </motion.div>

            {/* Floating elements on the opposite side */}
            <motion.div
                className="absolute right-8 top-1/2 -translate-y-1/2 z-40 w-64"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
            >
                <div className="glass-panel p-6 rounded-2xl backdrop-blur-lg border border-white/10">
                    <h3 className="text-[#7366FF] mb-3 text-lg font-semibold">Live Insights</h3>
                    <p className="text-gray-300 text-sm mb-2">Active Cases: 2.1M</p>
                    <p className="text-gray-300 text-sm mb-2">Vaccination Rate: 68%</p>
                    <p className="text-gray-300 text-sm">Predicted Peak: Dec 2023</p>
                </div>
            </motion.div>
        </div>
    );
}