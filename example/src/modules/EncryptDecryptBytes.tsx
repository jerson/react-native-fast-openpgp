import { Colors } from "react-native/Libraries/NewAppScreen";
import { Button, TextInput } from "react-native";
import React, { useState } from "react";
import OpenPGP from 'react-native-fast-openpgp';
import SectionContainer from "../components/SectionContainer";
import SectionTitle from "../components/SectionTitle";
import SectionResult from "../components/SectionResult";
import Container from "../components/Container";
import { base64Encode, uint8ArrayToString } from "../utils/codecs";

interface Props {
    publicKey: string,
    privateKey: string,
    passphrase: string
}

export default function ({ publicKey, privateKey, passphrase }: Props) {

    const [input, setInput] = useState<Uint8Array | undefined>();
    const [encrypted, setEncrypted] = useState<Uint8Array | undefined>();
    const [decrypted, setDecrypted] = useState<Uint8Array | undefined>();

    return <Container testID={'encrypt-decrypt-bytes'}>
        <SectionContainer testID={'encrypt'}>
            <SectionTitle>Encrypt Bytes</SectionTitle>
            <TextInput
                testID={'message'}
                onChangeText={(text) => {
                    const encoded = new global.TextEncoder().encode(text);
                    setInput(encoded);
                }}
                style={{ backgroundColor: Colors.white, borderRadius: 4 }}
                placeholder={"insert message here"}
            />
            <Button
                title={"Encrypt"}
                testID={'button'}
                onPress={async () => {
                    if (!input) {
                        return;
                    }
                    const output = await OpenPGP.encryptBytes(input, publicKey);
                    setEncrypted(output);
                }}
            />

            {!!encrypted && (
                <SectionResult testID={'result-raw'}>
                    bytes: {encrypted.join(", ")}
                </SectionResult>
            )}
            {!!encrypted && (
                <SectionResult testID={'result'}>
                    base64: {base64Encode(encrypted)}
                </SectionResult>
            )}
        </SectionContainer>
        {!!encrypted && (
            <SectionContainer testID={'decrypt'}>
                <SectionTitle>Decrypt Bytes</SectionTitle>
                <Button
                    title={"Decrypt"}
                    testID={'button'}
                    onPress={async () => {
                        const output = await OpenPGP.decryptBytes(
                            encrypted,
                            privateKey,
                            passphrase
                        );
                        setDecrypted(output);
                    }}
                />
                {!!decrypted && (
                    <SectionResult testID={'result-raw'}>
                        bytes: {decrypted.join(", ")}
                    </SectionResult>
                )}
                {!!decrypted && (
                    <SectionResult testID={'result'}>
                        decoded: {uint8ArrayToString(decrypted)}
                    </SectionResult>
                )}
            </SectionContainer>
        )}
    </Container>;
}
