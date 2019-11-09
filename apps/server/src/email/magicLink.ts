import mjml2html from "mjml";
import { routes } from "@howdypix/utils";

export const magicLink = ({
  name = "Foo Bar",
  code = "1234"
}: {
  name: string;
  code: string;
}): string =>
  mjml2html(`
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text font-size="30px" color="#F45E43" font-family="helvetica">Welcome ${name}!</mj-text>
          <mj-divider border-color="#F45E43"></mj-divider>
          <mj-text font-size="20px" color="#F45E43" font-family="helvetica">To authenticate, click <a href="${
            process.env.WEBAPP_BASE_URL
          }${routes.magickLinkValidation.value(code)} ">here</a>.</mj-text> 
          <mj-text font-size="10px" color="#F45E43" font-family="helvetica">You can also manually enter your secured code: <strong>${code}</strong>.</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`).html;
