import mobileHero from "../../assets/BalochDevLogo/mobile_hero.webp";

/**
 * Hero visual for /apps — uses the mobile_hero.webp asset.
 */
export default function AppsHeroPhoneIllustration() {
  return (
    <img
      src={mobileHero}
      alt="Mobile app development illustration"
      className="ndx-apps-hero-phone-svg"
      style={{
        width: "100%",
        height: "auto",
        display: "block",
      }}
    />
  );
}
