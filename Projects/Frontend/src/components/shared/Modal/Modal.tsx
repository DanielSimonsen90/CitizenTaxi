import { BaseProps, useEffectOnce } from "danholibraryrjs";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren & BaseProps<HTMLDialogElement> & {
  modalRef: React.RefObject<HTMLDialogElement>;
};

export default function Modal({ children, modalRef: ref, ...props }: Props) {
  useEffectOnce(() => {
    const listener = (e: MouseEvent) => {
      if (e.target === ref.current || (e.target as HTMLElement).classList.contains('close')) {
        ref.current?.close();
      }
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  });

  return (
    <dialog ref={ref} {...props}>
      <div className="modal-content">
        {children}
      </div>
    </dialog>
  );
}