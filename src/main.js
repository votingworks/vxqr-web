import './style.css'
import { verifyECDSASignature, base64UrlToBase64 } from './verify.js'

const publicKey = `
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEg12B72C1h64i9JK5Omojyu4hT77p
QhxXvCA/D0gYVRRIiuOxxof+4IysM6Lpk4tebN3OZHoyyQHrk/F6oQBa1w==
-----END PUBLIC KEY-----
`;

window.onload = window.onhashchange = async function () {
    const path = document.location.pathname;
    const hash = document.location.hash.substring(1);

    // extract the machine ID
    const serialNumberMatch = path.match("^/sn/([^/]+)$");
    if (serialNumberMatch) {
	const machineId = serialNumberMatch[1];
	document.getElementById('machineId').innerHTML = machineId;
	const signature = base64UrlToBase64(hash);
	const message = `1//signed-serial-number//sn=${machineId}`;
	
	const result = await verifyECDSASignature(message, signature, publicKey);

	if (result) {
	    document.getElementById('success').style.display = 'inline';
	    document.getElementById('failure').style.display = 'none';
	} else {
	    document.getElementById('failure').style.display = 'inline';
	    document.getElementById('success').style.display = 'none';
	}

    }
}

