#echo run build
date +'android start build time:'%Y-%m-%d-%H-%M-%S
rm ../build_file/*.apk
# cp ./android/customModules/ShareModule.java ./node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/share/ShareModule.java

# rm ../android/local.properties
# source ./configEnvScripts/findAndReplace.sh && getFileAndChangeJcenter && changeJSCHeader && changeBuildVersion
#手动修改buildToolVision

npm install
rm -rf ./node_modules/react-native-svg/android/build

# cp -f ../downloadResources/boost_1_57_0.zip ./node_modules/react-native/ReactAndroid/build/downloads/boost_1_57_0.zip

cd android && ./gradlew assembleRelease
cd ..

cp ./android/app/build/outputs/apk/*.apk ../build_file
rm ../build_file/*unaligned.apk

date +'android end build time:'%Y-%m-%d-%H-%M-%S
