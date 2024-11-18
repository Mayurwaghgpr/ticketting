import buildClient from "../apis/build-client";
import '../globals.css';
import Header from "../components/header";
const AppComponent = ({ Component, pageProps,currentuser }) => {

    return (
        <div>
        <Header currentuser={currentuser} />
        <div className="flex justify-center  h-screen">
          <Component currentuser={currentuser} {...pageProps} />
        </div>
        </div>)
};

AppComponent.getInitialProps = async appContext => {
// Create a client to make requests from the server
  const client = buildClient(appContext.ctx);

  try {
    // Fetch the current user
      const { data } = await client.get("/api/user/currentuser");
    let pageProps = {};
    
      if (appContext.Component.getInitialProps) {
          pageProps = await appContext.Component.getInitialProps(appContext.ctx,client,data.currentuser)
      }
    //   console.log({pageProps})
    // Pass fetched data as props to the component
      return { pageProps 
        , ...data
      };
  } catch (error) {
    // Handle any error in fetching
    console.error("Error fetching current user", error);
    return {};
  }
}

export default AppComponent;