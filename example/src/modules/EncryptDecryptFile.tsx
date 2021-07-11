import {Button, Text} from "react-native";
import React, { useEffect, useState} from "react";
import OpenPGP from 'react-native-fast-openpgp';
import SectionContainer from "../components/SectionContainer";
import SectionTitle from "../components/SectionTitle";
import SectionResult from "../components/SectionResult";
import Container from "../components/Container";
import { createFile, deleteFile } from "./Shared";

interface Props {
    publicKey: string,
    privateKey: string,
    passphrase: string
}

export default function ({publicKey, privateKey, passphrase}: Props) {

    const fileName = "sample-encrypt-decrypt-file.txt"
    const content = "sample"
    const [loading,setLoading] = useState(true);
    const [input,setInput] = useState('');
    const [output,setOutput] = useState('');
    const [encrypted, setEncrypted] = useState('');
    const [decrypted, setDecrypted] = useState('');

    useEffect(() => {
        createFile(fileName,content).then((value)=>{
            setInput(value);
            setOutput(value+".asc");
            setLoading(false);
        }) 

        return ()=>{
            deleteFile(fileName)
        }
    }, [])

    if (loading){
        return <Container><Text>...</Text></Container>
    }

    return <Container>
        <SectionContainer>
            <SectionTitle>Encrypt File</SectionTitle>
            <Button
                title={"Encrypt File"}
                onPress={async () => {
                    const result = await OpenPGP.encryptFile(input, output, publicKey);
                    setEncrypted(result);
                }}
            />
            <SectionResult>{encrypted}</SectionResult>
        </SectionContainer>
        {!!encrypted && (
            <SectionContainer>
                <SectionTitle>Decrypt File</SectionTitle>
                <Button
                    title={"Decrypt File"}
                    onPress={async () => {
                        const result = await OpenPGP.decryptFile(
                            output,
                            input,
                            privateKey,
                            passphrase
                        );
                        setDecrypted(result);
                    }}
                />
                {!!decrypted && (
                    <SectionResult>
                        {decrypted}
                    </SectionResult>
                )}
            </SectionContainer>
        )}
    </Container>;
}