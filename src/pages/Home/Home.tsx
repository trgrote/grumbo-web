import professional from '@assets/professional.jpg';

function Home() {
	return (
		<div className='h-screen flex justify-center items-center'>
			<div className='text-center'>
				<h1>Grumbo Professional Enterprises</h1>
				<img src={professional} />
				<p className="read-the-docs">
					We make business, matter
				</p>
			</div>
		</div>
	);
};

export default Home;
