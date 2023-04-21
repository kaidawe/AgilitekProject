// Page - Not Found

import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {

	useEffect(() => {
		document.title = `Agilitek Data Viz - Page Not Found`;
	}, []);
    
	return (
		<section className="page-not-found-section">
			<h2>404 ... : (</h2>
			<p>Page not found.</p>
			<p>Go to <Link to="/">User Dash</Link> page.</p>
		</section>
	);
	
};

export default PageNotFound;