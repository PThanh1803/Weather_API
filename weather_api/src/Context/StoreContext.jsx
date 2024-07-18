import { createContext, useEffect , useState} from "react";
import axios from "axios";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
    const url = "http://localhost:4000"
    const [token, setToken] = useState("")
    const [userData, setUserData] = useState({})
    const [city, setCity] = useState('Ho Chi Minh')
    const [currentCity, setCurrentCity] = useState('Ha Noi')
    const [location, setLocation] = useState('')


    const fetchUserData = async (token) => {
        try {
            const respone = await axios.post(`${url}/api/user/profile`,{},{headers:{token}})
            setUserData(respone.data.data)
            setCity(respone.data.data.location)
            
        } catch (error) {
            console.log("Error profile", error);
        }
    }

    const sendEmail = async () => {
        try {
            const respone = await axios.post(`${url}/api/email/subscribe`,{},{headers:{token}})
        } catch (error) {
            console.log("Error profile", error);
        }
    }

    const updateUserData = async  (announcement,location) => {
        try {
            const userAnnouncement = userData.announcement;
            const respone = await axios.post(`${url}/api/user/update`,{location,announcement},{headers:{token}})
            if(announcement !== userAnnouncement){
                sendEmail();
            }
        } catch (error) {
            console.log("Error profile", error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await fetchUserData(localStorage.getItem("token"));
            }
        }
    
        fetchData();
    });
    
    useEffect(() => {
        async function fetchCity() {
            if (localStorage.getItem("token")) {
                try {
                    const response = await fetchUserData(localStorage.getItem("token"));
                    setCity(response.data.data.location);
                } catch (error) {
                    console.error('Error fetching city:', error);
                }
            }
        }
    
        fetchCity();
    }, [location]); 
    

    const contextValue = {
        url,
        token,
        setToken,
        userData,
        city,
        setCity,
        currentCity,
        setCurrentCity,
        updateUserData,
        setLocation
    }

   
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider
