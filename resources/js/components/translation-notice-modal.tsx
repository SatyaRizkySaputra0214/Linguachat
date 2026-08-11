import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const translations: Record<string, { title: string; description: string; button: string }> = {
    en: {
        title: 'Translation Notice',
        description:
            'To get more accurate translations, please use standard and clear language when sending messages.',
        button: 'Got it',
    },
    id: {
        title: 'Informasi',
        description:
            'Untuk mendapatkan hasil terjemahan yang lebih akurat, gunakan bahasa yang baku/jelas saat mengirim pesan.',
        button: 'Mengerti',
    },
    th: {
        title: 'แจ้งเตือนการแปล',
        description:
            'เพื่อให้ได้ผลการแปลที่แม่นยำยิ่งขึ้น โปรดใช้ภาษาที่เป็นมาตรฐานและชัดเจนเมื่อส่งข้อความ',
        button: 'เข้าใจแล้ว',
    },
    ja: {
        title: '翻訳に関するお知らせ',
        description:
            'より正確な翻訳結果を得るために、メッセージを送信する際は標準的で明確な言葉をお使いください。',
        button: 'わかりました',
    },
    zh: {
        title: '翻译提示',
        description: '为了获得更准确的翻译结果，请在发送消息时使用标准清晰的语言。',
        button: '知道了',
    },
    fr: {
        title: 'Avis de traduction',
        description:
            'Pour obtenir des traductions plus précises, veuillez utiliser un langage standard et clair lors de l\'envoi de messages.',
        button: 'Compris',
    },
    es: {
        title: 'Aviso de traducción',
        description:
            'Para obtener traducciones más precisas, utilice un lenguaje estándar y claro al enviar mensajes.',
        button: 'Entendido',
    },
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    language: string;
};

export default function TranslationNoticeModal({ isOpen, onClose, language }: Props) {
    const t = translations[language] || translations.en;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t.title}</DialogTitle>
                    <DialogDescription className="mt-2 text-sm leading-relaxed">
                        {t.description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end">
                    <Button onClick={onClose} className="min-w-[100px]">
                        {t.button}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
