import {Button} from "react-native";
import React, {useState} from "react";
import OpenPGP from 'react-native-fast-openpgp';
import SectionContainer from "../components/SectionContainer";
import SectionTitle from "../components/SectionTitle";
import SectionResult from "../components/SectionResult";
import Container from "../components/Container";

interface Props {
    publicKey: string,
    privateKey: string,
    passphrase: string
}

export default function ({publicKey, privateKey, passphrase}: Props) {

    const [input] = useState('');
    const [output] = useState('');
    const [encrypted, setEncrypted] = useState('');
    const [decrypted, setDecrypted] = useState('');

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