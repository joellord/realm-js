////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import { MochaRemoteClient } from "mocha-remote-client";
import { handleAuthRedirect } from "realm-web";

if (location.pathname.endsWith("-callback")) {
    console.log("This is the callback from Google OAuth 2.0 flow");
    handleAuthRedirect();
} else {
    const mochaClient = new MochaRemoteClient({
        onInstrumented: () => {
            require("./app.test");
            require("./credentials.test");
            require("./user.test");
            require("./functions.test");
            require("./services.test");
            require("./api-key-auth-provider.test");
            require("./email-password-auth-provider.test");
        },
    });
}