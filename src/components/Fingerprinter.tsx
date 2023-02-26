import { useEffect, useState } from 'react';
import { getFingerprint, getRawFingerprint } from 'react-fingerprint';

export default function Fingerprinter() {
    const [fingerprint, setFingerprint] = useState("")
    const [fingerprintJSON, setFingerprintJSON] = useState(<p></p>)

    useEffect(() => {
        function syntaxHighlight(json: string) { // I lifted off of stack overflow and I do not want to make this look good
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }


        const run = async () => {
            setFingerprint(await getFingerprint())
            // @ts-ignore
            setFingerprintJSON(await syntaxHighlight(JSON.stringify(await getRawFingerprint(), 0, 4)))
        }

        run()
    }, [])

    return (
        <main>
            <h1>Your ID: {fingerprint}</h1>
            <h3>Raw data</h3>
            {/* @ts-ignore */}
            <pre id="json" dangerouslySetInnerHTML={{ __html: fingerprintJSON }}></pre>
        </main>
    )
}