import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase-config";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getProducts, getSettings, postSettings } from "./api";

const App = () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [token, setToken] = useState("");
  const [products, setProducts] = useState([]);
  const [follows, setFollows] = useState({});
  const [webhookUrl, setWebhookUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  const logout = async (e) => {
    signOut(auth);
    setToken("");
  };

  const onChangeCheckbox = (e) => {
    setFollows({ ...follows, [e.target.value]: e.target.checked });
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    if (await postSettings(token, follows, webhookUrl)) {
      alert("saved successfully");
    }
    setSaving(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const t = await user.getIdToken(false);
        setToken(t);
      } else {
        setToken("");
      }

      // console.log(token);
      unsubscribe();
    });
  });

  useEffect(() => {
    setLoading(true);
    (async () => {
      if (token) {
        setProducts(await getProducts(token));
        const settings = await getSettings(token);
        setFollows(
          settings.follows.reduce((a, v) => ({ ...a, [v]: true }), {})
        );
        setWebhookUrl(settings.webhook_url);
        setLoading(false);
      }
    })();
  }, [token]);

  const checkAll = () => {
    setFollows(products.reduce((a, v) => ({ ...a, [v]: true }), {}));
  };

  const uncheckAll = () => {
    setFollows(products.reduce((a, v) => ({ ...a, [v]: false }), {}));
  };

  return (
    <div className="mt-4 w-4/5 mx-auto">
      <div className="w-full mt-2">
        <h1 className="text-3xl font-bold">Release Notify</h1>
      </div>
      <div className="w-full mt-2">
        {!token ? (
          <div>
            <button
              className="px-4 py-2 border rounded hover:bg-gray-200"
              onClick={login}
            >
              Google Login
            </button>
          </div>
        ) : loading ? (
          <div className="flex justify-center">
            <div className="animate-spin mt-20 h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div>
            <div className="mt-4">
              <button
                className="px-4 py-2 rounded-xl border-2 hover:bg-gray-200 disabled:opacity-75 disabled:cursor-not-allowed"
                onClick={save}
                disabled={saving}
              >
                save
              </button>
              <button
                className="ml-2 px-4 py-2 rounded-xl border-2 hover:bg-gray-200 disabled:opacity-75 disabled:cursor-not-allowed"
                onClick={logout}
              >
                Logout
              </button>
            </div>
            <div className="mt-4 w-full flex justify-stretch items-center">
              <label className="ml-2 text-sm font-medium text-gray-900 mw-20">
                webhook_url
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="ml-4 bg-gray-50 border border-gray-300 text-sm rounded-xl focus:ring-black-500 w-full p-2"
              />
            </div>
            <div className="mt-4">
              <button
                className="px-4 py-2 rounded-xl border-2 hover:bg-gray-200 disabled:opacity-75 disabled:cursor-not-allowed"
                onClick={checkAll}
              >
                check all
              </button>
              <button
                className="ml-2 px-4 py-2 rounded-xl border-2 hover:bg-gray-200 disabled:opacity-75 disabled:cursor-not-allowed"
                onClick={uncheckAll}
              >
                uncheck all
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4">
              {products.map((e) => (
                <div key={e}>
                  <input
                    type="checkbox"
                    value={e}
                    checked={follows[e] ?? false}
                    onChange={onChangeCheckbox}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-900">
                    {e}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
