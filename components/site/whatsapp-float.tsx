import { whatsappLink } from "@/lib/site-config";

export function WhatsappFloat() {
  return (
    <a
      href={whatsappLink(
        "Olá! Vim pelo site e gostaria de solicitar uma cotação de frete.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-[#25D366] p-4 shadow-lg shadow-black/20 transition-transform hover:scale-105 sm:bottom-7 sm:right-7"
    >
      {/* Ícone do WhatsApp (a lucide-react não inclui marcas) */}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className="size-7 text-white"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.115-.198.057-.371-.058-.52-.116-.148-.694-1.673-.951-2.288-.235-.561-.475-.487-.65-.496l-.556-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.073.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.55 0-3.07-.42-4.4-1.2l-.32-.19-3.12.82.83-3.04-.2-.33a8.24 8.24 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.24-8.23 4.54 0 8.23 3.69 8.23 8.23 0 4.54-3.69 8.33-8.23 8.33z" />
      </svg>

      <span className="hidden pr-1 font-bold text-white sm:group-hover:inline">
        Fale com a gente
      </span>
    </a>
  );
}
