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

export default function ({passphrase}: Props) {

    const [input] = useState('');
    const [output] = useState('');
    const [encrypted, setEncrypted] = useState('');
    const [decrypted, setDecrypted] = useState('');

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