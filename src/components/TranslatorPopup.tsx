import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";

type TranslatorPopupProps = {
    text: string;
    onClose: () => void;
};

export const TranslatorPopup: React.FC<TranslatorPopupProps> = ({
                                                                    text,
                                                                    onClose,
                                                                }) => {
    return (
        <div
            className="absolute top-24 left-24 z-50"
            role="dialog"
            aria-label="Translation Popup"
        >
            <Card className="shadow-lg rounded-lg">
                <CardContent className="p-4">
                    <p className="text-base text-gray-700">{text}</p>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Close
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};
