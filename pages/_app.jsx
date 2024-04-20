// // _app.js
// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Layout from '../src/app/Layout';
// import { AuthProvider } from '../src/app/AuthContext';
// // import '../styles/globals.css';

// function MyApp({ Component, pageProps }) {
//   const router = useRouter();

//   // Example of global route change handling
//   useEffect(() => {
//     const handleRouteChange = (url) => {
//       console.log('Route is changing to:', url);
//       // Your custom logic here
//     };

//     router.events.on('routeChangeStart', handleRouteChange);

//     return () => {
//       router.events.off('routeChangeStart', handleRouteChange);
//     };
//   }, [router]);

//   return (
//     <AuthProvider>
//       <Layout>
//         <Component {...pageProps} />
//       </Layout>
//     </AuthProvider>
//   );
// }

// export default MyApp;
