import { CREATOR_NAME, DOMAIN_NAME, EMPLOYMENT_POSITION, GITHUB, REPORTS } from "SiteConstants";
import { useMediaQuery } from "danholibraryrjs";

export default function Footer() {
  const mobileView = useMediaQuery("(max-width: 575px)");
  const GithubLink = () => <a href={GITHUB} className="view-project">Se projektet på Github</a>;

  return (
    <footer className="site-footer" data-mobile={mobileView}>
      <p className="copyright muted">&copy; {new Date().getFullYear()} {CREATOR_NAME}</p>
      <div className="presentation">
        <p className="muted">{DOMAIN_NAME} af {CREATOR_NAME}, {EMPLOYMENT_POSITION}</p>
        <div className="links">
          <a href={REPORTS.PROCESS}>Procesrapport</a>
          {mobileView && <GithubLink />}
          <a href={REPORTS.PRODUCT}>Produktrapport</a>
        </div>
      </div>
      {!mobileView && <GithubLink />}
    </footer>
  );
}