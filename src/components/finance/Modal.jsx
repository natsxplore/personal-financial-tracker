export default function Modal({ children, wide = false }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4">
            <div
                className={`flex max-h-[min(520px,85vh)] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl ${
                    wide
                        ? "max-w-[340px] sm:max-w-[360px]"
                        : "max-w-[300px] sm:max-w-[320px]"
                }`}
            >
                {children}
            </div>
        </div>
    );
}
