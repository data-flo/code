<template>
  <div
    class="application"
  >
    <section class="intro">
      <div class="background" />
      <div class="contents">
        <div class="nav">
          <img src="~/static/images/data-flo-full-logo.svg">
          <nuxt-link
            class=""
            to="/transformations"
          >
            Transformations
          </nuxt-link>
          <a
            class=""
            href="https://docs.data-flo.io/"
          >
            Documentation
          </a>
          <a
            v-if="isAuthenticated"
            href="auth/signout"
          >
            Sign Out
          </a>
          <template v-else-if="isAnonymous">
            <nuxt-link to="/signin">
              Sign In
            </nuxt-link>
          </template>
        </div>
        <h1 class="display-3">
          <strong>Open-source</strong>,
          <strong>modular</strong>,
          and
          <br>
          <strong>extensible data integration</strong>
        </h1>
        <p>
          <nuxt-link
            to="/transformations"
          >
            Get Started
          </nuxt-link>
        </p>
      </div>
    </section>

    <section class="features">
      <div class="background" />
      <div class="contents">
        <v-container
          grid-list-xl
          text-xs-center
        >
          <v-flex row>
            <h2 class="display-1 d-none">
              Features
            </h2>
          </v-flex>
          <v-layout
            row
            wrap
          >
            <v-flex
              sm12
              md4
              column
              align-center
            >
              <v-avatar
                size="72"
                color="#673e90"
              >
                <v-icon
                  size="36"
                  color="white"
                >
                  mdi-auto-fix
                </v-icon>
              </v-avatar>
              <h3 class="display-1">
                Easy to use
              </h3>
              <p>
                Build data transformation dataflows by combining ready-to-use data adaptors.
              </p>
            </v-flex>
            <v-flex
              sm12
              md4
              column
              align-center
            >
              <v-avatar
                size="72"
                color="#673e90"
              >
                <v-icon
                  size="36"
                  color="white"
                >
                  mdi-laptop
                </v-icon>
              </v-avatar>
              <h3 class="display-1">
                Cross-platform
              </h3>
              <p>
                Data-flo is a web-based application which runs in your browser on any platform.
              </p>
            </v-flex>
            <v-flex
              sm12
              md4
              column
              align-center
            >
              <v-avatar
                size="72"
                color="#673e90"
              >
                <v-icon
                  size="36"
                  color="white"
                >
                  mdi-git
                </v-icon>
              </v-avatar>
              <h3 class="display-1">
                Open source
              </h3>
              <p>
                Data-flo is open source and free of charge.
                Source code is available under the
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://gitlab.com/cgps/data-flo-io/blob/master/LICENSE"
                > MIT License</a>
                on
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://gitlab.com/cgps/data-flo-io"
                > GitLab</a>.
              </p>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </section>

    <section class="users">
      <div class="background" />
      <div class="contents">
        <h2 class="display-1">
          Who's Using Data-flo
        </h2>
        <a
          title="Centre for Genomic Pathogen Surveillance"
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.pathogensurveillance.net/"
          class="ui basic button"
          role="button"
        >
          <img
            src="~/static/images/cgps-logo.svg"
            class="ui image"
          >
        </a>
        <a
          title="Centers for Disease Control and Prevention"
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.cdc.gov/"
          class="ui basic button"
          role="button"
        >
          <img
            src="~/static/images/cdc-logo.png"
            class="ui image"
          >
        </a>
        <a
          title="NIHR Global Health Research Unit: Genomic Surveillance of Antimicrobial Resistance"
          target="_blank"
          rel="noopener noreferrer"
          href="https://ghru.pathogensurveillance.net/"
          class="ui basic button"
          role="button"
        >
          <img
            src="~/static/images/ghru-logo.png"
            class="ui image"
          >
        </a>
        <a
          title="National Institute for Health Research"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.nihr.ac.uk/"
          class="ui basic button"
          role="button"
        >
          <img
            src="~/static/images/nihr-logo.png"
            class="ui image"
          >
        </a>
      </div>
    </section>

    <section class="footer">
      <div class="background" />
      <div class="contents">
        <div>
          <img
            class="ui tiny image"
            height="64px"
            src="~/static/images/data-flo-icon-logo.svg"
          >
          <p>
            Data-flo
            <strong>v{{ version }}</strong>
            is developed and maintained by the
            <br>
            <a
              title="Centre for Genomic Pathogen Surveillance"
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.pathogensurveillance.net/"
              role="button"
            >
              Centre for Genomic Pathogen Surveillance.
            </a>
          </p>
          <p>
            © 2019 Centre for Genomic Pathogen Surveillance
          </p>
        </div>
        <div>
          <h3>
            About
          </h3>
          <div class="list">
            <a
              href="https://docs.data-flo.io/"
              class="item"
            >
              Documentation
            </a>
            <a
              href="https://docs.data-flo.io/api"
              class="item"
            >
              API
            </a>
            <a
              href="https://gitlab.com/cgps/data-flo-io/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              class="item"
            >
              Submit an issue
            </a>
          </div>
        </div>
        <div>
          <h3>
            Get in touch
          </h3>
          <div class="list">
            <a
              title="Data-flo Community Support"
              target="_blank"
              rel="noopener noreferrer"
              href="https://community.pathogensurveillance.net/c/data-flo"
              class="item"
              role="button"
            >
              Community Support
            </a>
            <a
              title="Data-flo on Gitlab"
              target="_blank"
              rel="noopener noreferrer"
              href="https://gitlab.com/cgps/data-flo-io"
              class="item"
              role="button"
            >
              Gitlab
            </a>
            <a
              title="Data-flo on Twitter"
              target="_blank"
              rel="noopener noreferrer"
              href="https://twitter.com/datafloio"
              class="item"
              role="button"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </section>

    <script defer data-domain="data-flo.io" src="https://analytics.cgps.dev/js/plausible.js"></script>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapGetters({
      isAnonymous: "isAnonymous",
      isAuthenticated: "isAuthenticated",
      strategies: "strategies",
    }),
    ...mapState({
      version: "version",
    }),
  },
};
</script>

<style scoped>
.application {
  color: rgba(0, 0, 0, 0.87);
  flex-direction: column;
}
.primary--text {
  color: #673e90;
}

.display-1,
.display-3 {
  font-family: 'Saira Semi Condensed', sans-serif !important;
}

section {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 120px 40px;
}
section .background {
  bottom: 0px;
  left: 0px;
  margin: 0px;
  padding: 0px;
  position: absolute;
  right: 0px;
  top: 0px;
  transform: skewY(-2deg);
  z-index: 0;
}
section:first-child .background {
  transform: skewY(0deg);
}
section .contents {
  z-index: 1;
  max-width: 960px !important;
}
@media only screen and (min-width: 960px) {
  section .contents {
    width: 960px !important;
  }
}

section.intro {
  padding-bottom: 80px;
  margin-top: -120px;
}
section.intro .background {
  background-color: #dfdbe584;
  background-image: url("~static/images/circuit-board.svg");
  background-repeat: repeat;
}
section.intro .contents {
  text-align: center;
}

section.intro .contents .display-3 {
  font-weight: 300;
}

section.intro .nav {
  align-items: center;
  display: flex;
  height: 40px;
  margin: 24px 0 72px 0;
}
section.intro .nav img {
  height: 36px;
  margin-top: 6px;
  margin-right: auto;
}
section.intro .nav a {
  align-items: center;
  border-radius: 4px;
  border: 2px solid transparent;
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  font-weight: 500;
  height: 40px;
  margin: 0 8px;
  padding: 0 8px;
  text-decoration: none;
}
section.intro .nav a:hover {
  color: #673e90;
  border-color: #673e90;
}
section.intro .nav a:last-child {
  color: #673e90;
  border-color: #673e90;
}
section.intro .nav a:last-child:hover {
  background-color: #673e90;
  color: #fff;
}

section.intro p {
  align-items: center;
  justify-content: center;
  display: flex;
  height: 40px;
  margin: 30px 0;
}
section.intro p a {
  align-items: center;
  background-color: #673e90;
  border-radius: 4px;
  color: #fff;
  display: flex;
  font-size: 24px;
  font-weight: 700;
  padding: 8px 24px;
  text-decoration: none;
  line-height: 32px;
}
section.intro p a:hover {
  opacity: 0.87;
}

section.features {
  margin-top: -34px;
  z-index: 1;
}
section.features .background {
  background-color: hsl(271, 20%, 99%);
}
section.features .contents {
  display: flex;
  flex-direction: row;
}

section.features .contents > div {
  padding: 0 48px;
  width: 33.33%;
}
section.features .contents > div ~ div {
  border-left: solid 1px #cfcdd2;
}
section.features .contents > div h2 {
  line-height: 48px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
}
section.features .contents > div p {
  font-size: 16px;
  font-weight: 500;
  max-width: 320px;
  margin: auto;
}

section.users .background {
  background-color: #dfdbe584;
}
section.users .contents {
  text-align: center;
}

section.users h2 {
  margin: 16px 0;
  font-weight: 500;
}
section.users a {
  display: inline-flex;
  margin: 16px;
}
section.users a:hover {
  opacity: 0.87;
}
section.users img {
  height: 72px;
}

section.footer {
  padding-bottom: 0;
}
section.footer::before {
  content: "";
  position: absolute;
  margin: 0px;
  padding: 0px;
  top: 80px;
  left: 0px;
  right: 0px;
  bottom: -80px;
  z-index: 0;
  background-color: #1b1c1d;
}
section.footer .background {
  background-color: #1b1c1d;
}
section.footer .contents {
  color: rgba(255, 255, 255, 0.87);
  display: flex;
  flex-direction: row;
  font-size: 14px;
  line-height: 24px;
}
section.footer .contents h3 {
  font-size: 16px;
}
section.footer .contents > div {
  padding: 0 48px;
  width: 25%;
}
section.footer .contents > div > p {
  margin-bottom: 24px;
}
section.footer .contents > div:first-child {
  padding: 0 48px;
  width: 50%;
}
section.footer .contents > div ~ div {
  border-left: solid 1px #323334;
}
section.footer .contents a {
  color: rgba(255,255,255,.61);
  text-decoration: none;
}
section.footer .contents a:hover {
  color: #fff;
  text-decoration: none;
}
section.footer .contents .list {
  display: flex;
  flex-direction: column;
}
</style>
