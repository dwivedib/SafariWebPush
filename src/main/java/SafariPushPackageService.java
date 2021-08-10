import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class SafariPushPackageService extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Log log = LogFactory.getLog(SafariPushPackageService.class);

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        serve(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        serve(req, resp);
    }

    private void serve(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType("text/plain");
        String clientOrigin = request.getHeader("origin");
        response.setHeader("Access-Control-Allow-Origin", clientOrigin);
        if (request.getPathInfo().contains("/pushPackages/")) {
            String site = request.getPathInfo().split("/pushPackages/")[1];
            log.info("<--------| Serving push package for websitePushID " + site);
            getZip(response);
        } else if (request.getPathInfo().endsWith("/log")) {
            // webServiceURL/version/log
            try {
                log.info("---------| Log request received. " + readBody(request));
            } catch (Exception e) {
                log.info("Error in logging request", e);
            }
        }
    }
    private String readBody(HttpServletRequest request) throws IOException {
        // Read from request
        StringBuilder buffer = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }
        return buffer.toString();
    }
    private void getZip(HttpServletResponse response){
        String fileName = "/Users/anupamamishra/Downloads/WebPush-master/safariPackage/pushPackage.zip";
        response.setContentType("application/zip");
        response.setHeader("Content-Disposition","attachment;filename=\"pushPackage.bin\"");
        FileInputStream is = null;
        try{
            File f = new File(fileName);
            int length = (int)f.length();
            byte[] arBytes = new byte[length];
            response.setContentLength(length);
            is = new FileInputStream(f);
            is.read(arBytes);
            is.close();
            ServletOutputStream op = response.getOutputStream();
            op.write(arBytes);
            op.flush();
            response.flushBuffer();
        }catch(IOException ioe)
        {
            log.info("Error while loading" + fileName + "zip",ioe);
        }finally {
            try {
                if(is!=null){
                    is.close();
                }
            } catch (IOException e) {
                log.info("Error while closing stream " + fileName + "zip", e);
            }
        }
    }
}

