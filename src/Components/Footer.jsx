import { Footer } from "flowbite-react";
import React from "react";
import {
  BsFacebook,
  BsFileEarmarkPerson,
  BsGithub,
  BsInstagram,
  BsLinkedin,
  BsTwitter,
} from "react-icons/bs";
const FooterCom = () => {
  return (
    <Footer
      container
      className="border-t-gray-200 dark:border-t-gray-700 border-t-2"
    >
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <Footer.Brand
              href="#"
              src="https://cdn-icons-png.flaticon.com/512/16843/16843037.png"
              alt="Blog IT! Logo"
              name="Blog IT!"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="Technology" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Flowbite</Footer.Link>
                <Footer.Link href="#">Tailwind CSS</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://github.com/MohamedUmar083">
                  Github
                </Footer.Link>
                <Footer.Link href="https://www.linkedin.com/in/mohamed-umar-s-782893206/">
                  LinkedIn
                </Footer.Link>
                <Footer.Link href="https://mohamedumar.netlify.app/">
                  Portfolio
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Mohamed Umar S™"
            year={new Date().getFullYear()}
          />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon
              href="https://mohamedumar.netlify.app/"
              icon={BsFileEarmarkPerson}
            />
            <Footer.Icon
              href="https://github.com/MohamedUmar083"
              icon={BsGithub}
            />
            <Footer.Icon
              href="https://www.linkedin.com/in/mohamed-umar-s-782893206/"
              icon={BsLinkedin}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;
