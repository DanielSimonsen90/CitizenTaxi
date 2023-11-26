import { BaseProps, Button, useEffectOnce } from "danholibraryrjs";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren & BaseProps<HTMLDialogElement> & {
  modalRef: React.RefObject<HTMLDialogElement>;
};

export type { Props as ModalProps };

export default function Modal({ children, modalRef: ref, ...props }: Props) {
  // useEffectOnce only runs once, when the component is mounted
  useEffectOnce(() => {
    // Define a listener that closes the modal when clicking outside of it
    const listener = (e: MouseEvent) => {
      if (e.target === ref.current || (e.target as HTMLElement).classList.contains('close')) {
        ref.current?.close();
      }
    };

    // Add the listener to the document and remove it when the component is unmounted
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  });

  return (
    <dialog ref={ref} {...props}>
      <div className="modal-content">
        <Button type="button" className="close" importance="tertiary">&times;</Button>
        {children}
      </div>
    </dialog>
  );
}