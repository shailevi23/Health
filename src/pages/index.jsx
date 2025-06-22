import Layout from "./Layout.jsx";
import Home from "./Home";
import Blog from "./Blog";
import Recipes from "./Recipes";
import About from "./About";
import Recommended from "./Recommended";
import BlogPost from "./BlogPost";
import RecipeDetail from "./RecipeDetail";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth.jsx";
import AuthPage from "./Auth.jsx";

const PAGES = {
    Home: Home,
    Blog: Blog,
    Recipes: Recipes,
    About: About,
    Recommended: Recommended,
    BlogPost: BlogPost,
    RecipeDetail: RecipeDetail,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

function MainApp() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Blog" element={<Blog />} />
                <Route path="/Recipes" element={<Recipes />} />
                <Route path="/About" element={<About />} />
                <Route path="/Recommended" element={<Recommended />} />
                <Route path="/BlogPost" element={<BlogPost />} />
                <Route path="/RecipeDetail" element={<RecipeDetail />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <Router>
            {user ? <MainApp /> : <AuthPage />}
        </Router>
    );
}