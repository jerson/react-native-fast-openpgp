import {Button, Text} from "react-native";
import React, {useEffect, useState} from "react";
import OpenPGP from 'react-native-fast-openpgp';
import SectionContainer from "../components/SectionContainer";
import SectionTitle from "../components/SectionTitle";
import SectionResult from "../components/SectionResult";
import Container from "../components/Container";
import {createFile, deleteFile } from "./Shared";

interface Props {
    publicKey: string,
    privateKey: string,
    passphrase: string
}

export default function ({publicKey, privateKey, passphrase}: Props) {

    const fileName = "sample-sign-file.txt"
    const content = "sample"
    const [loading,setLoading] = useState(true);
    const [input,setInput] = useState('');
    const [signed, setSigned] = useState('');
    const [verified, setVerified] = useState(false);
    
    useEffect(() => {
        createFile(fileName,content).then((value)=>{
            setInput(value);
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
            <SectionTitle>Sign File</SectionTitle>
            <Button
                title={"Sign File"}
                onPress={async () => {
                    const output = await OpenPGP.signFile(
                        input,
                        publicKey,
                        privateKey,
                        passphrase
                    );
                    setSigned(output);
                }}
            />
            <SectionResult>{signed}</SectionResult>
        </SectionContainer>
        {!!signed && (
            <SectionContainer>
                <SectionTitle>Verify File</SectionTitle>
                <Button
                    title={"Verify File"}
                    onPress={async () => {
                        const output = await OpenPGP.verifyFile(
                            signed,
                            input,
                            publicKey
                        );

                        setVerified(output);
                    }}
                />
                {typeof verified !== 'undefined' && (
                    <SectionResult>
                        {verified ? 'valid' : 'invalid'}
                    </SectionResult>
                )}
            </SectionContainer>
        )}
    </Container>;
}