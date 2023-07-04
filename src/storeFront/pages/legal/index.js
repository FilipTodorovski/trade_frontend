import React from 'react';

import styled from 'styled-components';

const Legal = () => {
  return (
    <CopmonentContainer>
      <p>
        <b>Trade Sprint - Legal Notice</b>
      </p>
      <p>Last Updated 21st September 2020</p>
      <hr />
      <br />
      <p>
        Trade Sprint Ltd
        <br />
        Phone: +447535318390
        <br />
        Email: hello@TradeSprint.co.uk
        <br />
        <br />
        WEBSITE DISCLAIMER
        <br />
        <br />
        The information provided by Trade Sprint Ltd (“we,” “us” or “our”) on
        www.TradeSprint.co.uk (the “Site”) and our mobile application is for
        general informational purposes only. All information on the Site and our
        mobile application is provided in good faith, however we make no
        representation or warranty of any kind, express or implied, regarding
        the accuracy, adequacy, validity, reliability, availability or
        completeness of any information on the Site or our mobile application.
        UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR
        DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR OUR
        MOBILE APPLICATION OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE
        AND OUR MOBILE APPLICATION. YOUR USE OF THE SITE AND OUR MOBILE
        APPLICATION AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE AND OUR
        MOBILE APPLICATION IS SOLELY AT YOUR OWN RISK.
        <br />
        <br />
        EXTERNAL LINKS DISCLAIMER
        <br />
        <br />
        The Site and our mobile application may contain (or you may be sent
        through the Site or our mobile application) links to other websites or
        content belonging to or originating from third parties or links to
        websites and features in banners or other advertising. Such external
        links are not investigated, monitored, or checked for accuracy,
        adequacy, validity, reliability, availability or completeness by us. WE
        DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE
        ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRDPARTY
        WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY
        BANNER OR OTHER ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE
        RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY
        PROVIDERS OF PRODUCTS OR SERVICES.
        <br />
        <br />
        PROFESSIONAL DISCLAIMER
        <br />
        <br />
        The Site cannot and does not contain web development advice. The web
        development information is provided for general informational and
        educational purposes only and is not a substitute for professional
        advice. Accordingly, before taking any actions based upon such
        information, we encourage you to consult with the appropriate
        professionals. We do not provide any kind of web development advice. THE
        USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THIS SITE OR OUR MOBILE
        APPLICATION IS SOLELY AT YOUR OWN RISK.
        <br />
        <br />
        <br />
        TESTIMONIALS DISCLAIMER
        <br />
        <br />
        The Site may contain testimonials by users of our products and/or
        services. These testimonials reflect the real-life experiences and
        opinions of such users. However, the experiences are personal to those
        particular users, and may not necessarily be representative of all users
        of our products and/or services. We do not claim, and you should not
        assume, that all users will have the same experiences. YOUR INDIVIDUAL
        RESULTS MAY VARY.
        <br />
        <br />
        The testimonials on the Site are submitted in various forms such as
        text, audio and/or video, and are reviewed by us before being posted.
        They appear on the Site verbatim as given by the users, except for the
        correction of grammar or typing errors. Some testimonials may have been
        shortened for the sake of brevity where the full testimonial contained
        extraneous information not relevant to the general public.
        <br />
        <br />
        The views and opinions contained in the testimonials belong solely to
        the individual user and do not reflect our views and opinions. We are
        not affiliated with users who provide testimonials, and users are not
        paid or otherwise compensated for their testimonials.
      </p>
    </CopmonentContainer>
  );
};
const CopmonentContainer = styled.div`
  padding: 0 20px;
  font-size: 22px;
  width: 100%;
  max-width: 1280px;
  margin: 50px auto;

  p {
    font-size: 22px;
    lineheight: 28px;
  }
`;
export default Legal;
