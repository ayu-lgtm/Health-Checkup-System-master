import axios from 'axios';
import parser from 'fast-xml-parser';

const isAuthenticated = async (userId, password) => {
    const soapRequest = `
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
        <IsAuthenticated xmlns="http://tempuri.org/">
        <domain>TATASTEEL</domain>
        <userName>${userId}</userName>
        <password>${password}</password>
        </IsAuthenticated>
        </soap:Body>
        </soap:Envelope>`;

    const apiUrl = `https://tslapiadso.corp.tatasteel.com/FSSO/Service.asmx`;

    const soapAction = `http://tempuri.org/IsAuthenticated`;

    try {
        const { data } = await axios.post(apiUrl, soapRequest, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': soapAction
            }
        });
        let result = null;
        const parsedData = parser.parse(data);
        result = parsedData['soap:Envelope']['soap:Body'].IsAuthenticatedResponse.IsAuthenticatedResult;
        return result;
    } catch (error) {
        throw new Error(error.response?.data || error.message || 'Failed to authenticate');
    }
};

export default isAuthenticated;

