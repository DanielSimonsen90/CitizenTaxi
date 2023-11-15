import { PropsWithChildren } from "react";
import { useEffectOnce } from "danholibraryrjs";
import { DOMAIN_NAME } from 'SiteConstants';

type PageProps = PropsWithChildren & {
  description: string;

  title?: string;
  thumbnail?: string;
};

export default function PageLayout({ title, description, children, thumbnail }: PageProps) {
  // Set the page title and description from the props
  useEffectOnce(() => {
    document.title = title ? `${title} - ${DOMAIN_NAME}` : DOMAIN_NAME;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);

    if (thumbnail) document.querySelector('meta[name="thumbnail"]')?.setAttribute("content", thumbnail);
  });

  return <>{children}</>;
}