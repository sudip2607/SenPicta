import React from "react";
import { Heart, Users, Building, Camera, Star } from "lucide-react";

const services = [
	{
		icon: <Heart className="w-8 h-8 text-yellow-400 mb-2" />,
		title: "Prints",
		desc: "Buy high-quality prints of my best photos.",
	},
	{
		icon: <Camera className="w-8 h-8 text-yellow-400 mb-2" />,
		title: "Digital Downloads",
		desc: "Purchase digital versions for personal use.",
	},
	{
		icon: <Star className="w-8 h-8 text-yellow-400 mb-2" />,
		title: "Collaboration",
		desc: "Let’s work together on creative projects.",
	},
	{
		icon: <Users className="w-8 h-8 text-yellow-400 mb-2" />,
		title: "Photo Sharing",
		desc: "Share my work to help me grow and get recognized.",
	},
	{
		icon: <Building className="w-8 h-8 text-yellow-400 mb-2" />,
		title: "Custom Requests",
		desc: "Request custom shoots or edits.",
	},
];

export default function Services() {
	return (
		<div className="min-h-screen bg-white py-20">
			<div className="max-w-7xl mx-auto px-6">
				{/* Header */}
				<div className="text-center mb-20">
					<h1
						className="text-4xl md:text-6xl font-bold mb-6"
						style={{ color: "#d4af37" }}
					>
						Services
					</h1>
					<p className="text-xl text-gray-700 max-w-3xl mx-auto">
						Still in progress, will be up and running soon once legal complications are resolved. 
						I plan to offer prints, digital downloads, and creative collaborations. Please support my journey by offering me a coffee or sharing my work with your friends and colleagues!
					</p>
				</div>

				{/* Services */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-center">
					{services.map((service, idx) => (
						<div
							key={idx}
							className="bg-yellow-50 rounded-lg p-6 shadow-lg flex flex-col items-center border border-yellow-100"
						>
							{service.icon}
							<span
								className="font-semibold mb-1"
								style={{ color: "#222" }}
							>
								{service.title}
							</span>
							<span className="text-gray-600 text-sm">
								{service.desc}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}