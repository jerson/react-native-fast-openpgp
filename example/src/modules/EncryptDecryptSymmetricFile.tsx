import {Button, Text} from "react-native";
import React, {useEffect, useState} from "react";
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

export default function ({passphrase}: Props) {

    const fileName = "sample-encrypt-decrypt-symmetric-file.txt"
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
            <SectionTitle>Encrypt Symmetric File</SectionTitle>
            <Button
                title={"Encrypt Symmetric File"}
                onPress={async () => {
                    const result = await OpenPGP.encryptSymmetricFile(
                        input,
                        output,
                        passphrase
                    );
                    setEncrypted(result);
                }}
            />
            <SectionResult>{encrypted}</SectionResult>
        </SectionContainer>
        {!!encrypted && (
            <SectionContainer>
                <SectionTitle>Decrypt Symmetric File</SectionTitle>
                <Button
                    title={"Decrypt Symmetric File"}
                    onPress={async () => {
                        const result = await OpenPGP.decryptSymmetricFile(
                            output,
                            input,
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